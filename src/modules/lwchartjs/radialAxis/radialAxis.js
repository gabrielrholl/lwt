import BaseAxis from 'lwchartjs/baseAxis';
import { ATTRIBUTE_RADIAL_AXES } from 'lwchartjs/constants';

/**
 * https://www.chartjs.org/docs/latest/axes/radial/
 *
 * NOTES:
 *      Radial axes are available only for Radar and Polar area chart types
 */
export default class RadialAxis extends BaseAxis {
    constructor() {
        super();
        this._option = ATTRIBUTE_RADIAL_AXES;
    }
}
