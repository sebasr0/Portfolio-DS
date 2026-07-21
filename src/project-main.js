/** Composition root — case-study page. */
import './styles/tokens.css';
import './styles/global.css';
import './styles/home.css'; // shared card/tag styles
import './styles/project.css';

import { InMemoryProjectRepository } from './data/InMemoryProjectRepository.js';
import { makeGetProjectById } from './domain/usecases/getProjectById.js';
import { makeProjectPage } from './ui/pages/ProjectPage.js';
import { initChrome } from './ui/nav.js';

const repository = new InMemoryProjectRepository();
const projectPage = makeProjectPage({ getProjectById: makeGetProjectById(repository) });

initChrome();
projectPage.render(new URLSearchParams(window.location.search).get('id'));
