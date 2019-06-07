/**
 * This module will run once before all tests
 */
import config from 'config';
import { getFormData } from '@oneaccount/test-common';
import { contextsFactory, Region } from './utils/contexts/extensions';

// Setup contexts global function. Used by each test suite to access regional
// contexts to run against.
global.contexts = contextsFactory(config);
global.Region = Region;
global.User = getFormData();
