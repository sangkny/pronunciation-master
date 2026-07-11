import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ONTOLOGY_PATH = join(__dirname, '../../data/ontology.json');

const DIFFICULTY_ORDER = { beginner: 0, intermediate: 1, advanced: 2 };
const USER_LEVEL_MAX = { beginner: 0, intermediate: 1, advanced: 2 };

export class OntologyEngine {
  constructor() {
    this.ontology = null;
    this.conceptIndex = new Map();
    this.domainIndex = new Map();
    this.userProgress = new Map();
  }

  loadOntology() {
    if (this.ontology) return this.ontology;

    if (!existsSync(ONTOLOGY_PATH)) {
      throw new Error(`Ontology file not found: ${ONTOLOGY_PATH}`);
    }

    let raw;
    try {
      raw = readFileSync(ONTOLOGY_PATH, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read ontology file: ${error.message}`);
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      throw new Error(`Invalid ontology JSON: ${error.message}`);
    }

    if (!data.domains || !Array.isArray(data.domains)) {
      throw new Error('Ontology data must contain a domains array');
    }

    this.ontology = data;
    this._buildIndexes();
    return this.ontology;
  }

  _buildIndexes() {
    this.conceptIndex.clear();
    this.domainIndex.clear();

    for (const domain of this.ontology.domains) {
      this.domainIndex.set(domain.id, domain);
      for (const concept of domain.concepts) {
        this.conceptIndex.set(concept.id, { ...concept, domainId: domain.id, domainName: domain.name });
      }
    }
  }

  _ensureLoaded() {
    if (!this.ontology) this.loadOntology();
  }

  getDomains() {
    this._ensureLoaded();
    return this.ontology.domains.map(({ id, name, concepts }) => ({
      id,
      name,
      conceptCount: concepts.length,
    }));
  }

  getConceptsByDomain(domainId) {
    this._ensureLoaded();
    const domain = this.domainIndex.get(domainId);
    if (!domain) {
      throw new Error(`Domain not found: ${domainId}`);
    }
    return domain.concepts.map(c => this._summarizeConcept(c, domainId));
  }

  getConcept(conceptId) {
    this._ensureLoaded();
    const concept = this.conceptIndex.get(conceptId);
    if (!concept) {
      throw new Error(`Concept not found: ${conceptId}`);
    }
    const { domainId, domainName, ...rest } = concept;
    return { ...rest, domainId, domainName };
  }

  getPrerequisiteConcepts(conceptId) {
    this._ensureLoaded();
    const concept = this.conceptIndex.get(conceptId);
    if (!concept) {
      throw new Error(`Concept not found: ${conceptId}`);
    }
    return concept.prerequisites.map(id => {
      const prereq = this.conceptIndex.get(id);
      if (!prereq) return null;
      return this._summarizeConcept(prereq, prereq.domainId);
    }).filter(Boolean);
  }

  getConceptsByDifficulty(domainId, difficulty) {
    this._ensureLoaded();
    const domain = this.domainIndex.get(domainId);
    if (!domain) {
      throw new Error(`Domain not found: ${domainId}`);
    }
    const normalized = difficulty.toLowerCase();
    return domain.concepts
      .filter(c => c.difficulty === normalized)
      .map(c => this._summarizeConcept(c, domainId));
  }

  getVocabularyByConcept(conceptId) {
    const concept = this.getConcept(conceptId);
    return {
      conceptId: concept.id,
      conceptName: concept.name,
      domainId: concept.domainId,
      vocabulary: concept.vocabulary,
    };
  }

  generateLearningPath(domainId, userLevel = 'beginner') {
    this._ensureLoaded();
    const domain = this.domainIndex.get(domainId);
    if (!domain) {
      throw new Error(`Domain not found: ${domainId}`);
    }

    const level = userLevel.toLowerCase();
    const maxDifficulty = USER_LEVEL_MAX[level] ?? 0;

    const eligible = domain.concepts.filter(
      c => DIFFICULTY_ORDER[c.difficulty] <= maxDifficulty
    );

    const sorted = this._topologicalSort(eligible);
    const completed = new Set();

    const path = sorted.map((concept, index) => {
      const prereqsMet = concept.prerequisites.every(p => completed.has(p));
      const status = prereqsMet ? 'available' : 'locked';
      if (prereqsMet) completed.add(concept.id);

      return {
        order: index + 1,
        conceptId: concept.id,
        name: concept.name,
        difficulty: concept.difficulty,
        prerequisites: concept.prerequisites,
        status,
        vocabularyCount: concept.vocabulary.length,
      };
    });

    return {
      domainId,
      domainName: domain.name,
      userLevel: level,
      totalConcepts: path.length,
      path,
    };
  }

  recommendNextConcept(userId, currentConceptId) {
    this._ensureLoaded();

    if (!currentConceptId) {
      throw new Error('currentConceptId is required');
    }

    const current = this.conceptIndex.get(currentConceptId);
    if (!current) {
      throw new Error(`Concept not found: ${currentConceptId}`);
    }

    const domain = this.domainIndex.get(current.domainId);
    const userKey = userId || 'anonymous';
    const progress = this.userProgress.get(userKey) || new Set();
    progress.add(currentConceptId);
    this.userProgress.set(userKey, progress);

    const candidates = domain.concepts.filter(c => {
      if (progress.has(c.id)) return false;
      return c.prerequisites.every(p => progress.has(p));
    });

    if (candidates.length === 0) {
      return {
        userId: userKey,
        currentConceptId,
        recommendation: null,
        message: 'All available concepts completed or prerequisites not met',
        completedCount: progress.size,
      };
    }

    candidates.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
    const next = candidates[0];

    return {
      userId: userKey,
      currentConceptId,
      recommendation: this._summarizeConcept(next, current.domainId),
      completedCount: progress.size,
      remainingCount: domain.concepts.length - progress.size,
    };
  }

  markConceptCompleted(userId, conceptId) {
    const userKey = userId || 'anonymous';
    const progress = this.userProgress.get(userKey) || new Set();
    progress.add(conceptId);
    this.userProgress.set(userKey, progress);
    return { userId: userKey, completedConcepts: [...progress] };
  }

  _summarizeConcept(concept, domainId) {
    return {
      id: concept.id,
      name: concept.name,
      domainId,
      difficulty: concept.difficulty,
      prerequisites: concept.prerequisites,
      vocabularyCount: concept.vocabulary.length,
    };
  }

  _topologicalSort(concepts) {
    const idSet = new Set(concepts.map(c => c.id));
    const adj = Object.fromEntries(concepts.map(c => [c.id, c.prerequisites.filter(p => idSet.has(p))]));
    const inDegree = Object.fromEntries(concepts.map(c => [c.id, 0]));
    for (const c of concepts) {
      for (const p of adj[c.id]) {
        inDegree[c.id]++;
      }
    }

    const queue = concepts.filter(c => inDegree[c.id] === 0);
    const result = [];

    while (queue.length > 0) {
      queue.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
      const current = queue.shift();
      result.push(current);
      for (const c of concepts) {
        if (adj[c.id].includes(current.id)) {
          inDegree[c.id]--;
          if (inDegree[c.id] === 0) queue.push(c);
        }
      }
    }

    if (result.length !== concepts.length) {
      throw new Error('Circular dependency detected in ontology');
    }

    return result;
  }
}

export const ontologyEngine = new OntologyEngine();
