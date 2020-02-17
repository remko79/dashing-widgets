import { IDWConfig } from '../typed_config';
import dashboards from './dashboards';
import backend from './backend';

const config: IDWConfig = {
  dashboards,

  // Add endpoints/tokens, etc in <env / local>.ts
  backend,
};

export default config;
