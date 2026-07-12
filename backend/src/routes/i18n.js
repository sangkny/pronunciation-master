import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Router } from 'express';

const __dirname = dirname(fileURLToPath(import.meta.url));
const curriculumPath = join(__dirname, '../../data/regional-curriculum.json');

let curriculumData = null;

function loadCurriculum() {
  if (!curriculumData) {
    curriculumData = JSON.parse(readFileSync(curriculumPath, 'utf-8'));
  }
  return curriculumData;
}

const router = Router();

router.get('/locales', (req, res) => {
  const data = loadCurriculum();
  res.json({ success: true, locales: data.locales });
});

router.get('/curriculum/:locale', (req, res) => {
  const data = loadCurriculum();
  const locale = req.params.locale;
  const curriculum = data.curricula[locale];

  if (!curriculum) {
    return res.status(404).json({
      success: false,
      error: `Locale not found: ${locale}`,
      available: Object.keys(data.curricula),
    });
  }

  res.json({ success: true, locale, ...curriculum });
});

export default router;
