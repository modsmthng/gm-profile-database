import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schemaJson from '../schema/index.schema.json';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const validator = ajv.compile(schemaJson);
