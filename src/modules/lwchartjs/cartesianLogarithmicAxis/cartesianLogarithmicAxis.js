import CartesianAxis from 'lwchartjs/cartesianAxis';
import { CARTESIAN_AXIS_TYPE_LOG } from 'lwchartjs/constants';

/**
 * https://www.chartjs.org/docs/latest/axes/cartesian/logarithmic.html
 */
export default class CartesianLogarithmicAxis extends CartesianAxis {
    constructor() {
        super();
        this._content.type = CARTESIAN_AXIS_TYPE_LOG;
    }
}
