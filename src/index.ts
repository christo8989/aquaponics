import { of } from 'rxjs';
import { testScheduler } from '~/utils/test.helpers';

of('abc');
console.log('Hello World!', testScheduler);