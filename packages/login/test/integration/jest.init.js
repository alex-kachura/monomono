import config from 'config';
import { contextsFactory, Region } from './utils/contexts/extensions';

// Setup contexts global function. Used by each test suite to access regional
// contexts to run against.
global.contexts = contextsFactory(config);
global.Region = Region;
