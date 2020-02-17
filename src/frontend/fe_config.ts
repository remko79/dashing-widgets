// DW_CONFIG is injected by webpack.
import { IDWConfig } from '../../typed_config';

declare const DW_CONFIG: IDWConfig;

const DW_TMP = DW_CONFIG;

// eslint-disable-next-line import/prefer-default-export
export { DW_TMP as DW_CONFIG };
