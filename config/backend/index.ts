import GitLab from './gitlab';
import Katalon from './katalon';
import OpsGenie from './opsgenie';
import { ICfgBackend } from '../../typed_config';

const backend: ICfgBackend = {
  gitlab: GitLab,
  katalon: Katalon,
  opsgenie: OpsGenie,
};

export default backend;
