import { dbManager } from './dbManager.js';
import { ontologyEngine } from './ontologyEngine.js';

class CustomOntologyManager {
  validateOntologyData(data) {
    if (!data?.domainId || !data?.name) {
      throw new Error('domainId and name are required');
    }
    if (!Array.isArray(data.concepts)) {
      throw new Error('concepts must be an array');
    }
    return true;
  }

  async listCustomOntologies(userId) {
    return dbManager.getCustomOntologies(userId);
  }

  async getCustomOntology(userId, domainId) {
    const custom = await dbManager.getCustomOntology(userId, domainId);
    if (!custom) {
      throw new Error(`Custom ontology not found: ${domainId}`);
    }
    return custom;
  }

  async createCustomOntology(userId, data) {
    this.validateOntologyData(data);
    return dbManager.saveCustomOntology(userId, data.domainId, data.name, {
      concepts: data.concepts,
      metadata: data.metadata || {},
    });
  }

  async updateCustomOntology(userId, domainId, data) {
    const existing = await this.getCustomOntology(userId, domainId);
    const merged = {
      ...existing.ontology_data,
      concepts: data.concepts ?? existing.ontology_data.concepts,
      metadata: data.metadata ?? existing.ontology_data.metadata,
    };
    return dbManager.saveCustomOntology(
      userId,
      domainId,
      data.name || existing.name,
      merged
    );
  }

  async deleteCustomOntology(userId, domainId) {
    const deleted = await dbManager.deleteCustomOntology(userId, domainId);
    if (!deleted) {
      throw new Error(`Custom ontology not found: ${domainId}`);
    }
    return deleted;
  }

  async mergeWithBase(userId, domainId) {
    const custom = await dbManager.getCustomOntology(userId, domainId);
    if (!custom) {
      throw new Error(`Custom ontology not found: ${domainId}`);
    }

    let baseConcepts = [];
    try {
      baseConcepts = ontologyEngine.getConceptsByDomain(domainId);
    } catch {
      baseConcepts = [];
    }

    const customConcepts = custom.ontology_data?.concepts || [];
    const mergedConcepts = [
      ...baseConcepts,
      ...customConcepts.map((c) => ({ ...c, custom: true })),
    ];

    return {
      domainId,
      name: custom.name,
      baseConceptCount: baseConcepts.length,
      customConceptCount: customConcepts.length,
      totalConcepts: mergedConcepts.length,
      concepts: mergedConcepts,
    };
  }
}

export const customOntologyManager = new CustomOntologyManager();
