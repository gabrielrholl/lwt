import { ATTRIBUTE_CARTESIAN_AXES } from 'lwchartjs/constants';

export default class ChartConfigService {
    static defaultConfiguration() {
        return {
            legend: {
                display: false,
            },
        };
    }

    constructor() {
        this._config = ChartConfigService.defaultConfiguration(); // clone default configuration
        this._scales = {
            xAxes: {},
            yAxes: {},
        };
        this._dirty = true; // build dirty
    }

    // make the component dirty
    // merge option sent to update the config Chart.js object
    updateConfig(payload, option) {
        this._dirty = true;
        // When no option it is a base object
        // so merge object
        if (!option) {
            this._config = {
                ...this._config,
                ...payload,
            };
        } else {
            this._config[option] = this._config[option] || {};

            console.log('processing in ChartConfigService');
            console.log('option -> ' + option);
            console.log('payload -> ' + JSON.stringify(payload, null, 2));
            console.log('scales -> ' + JSON.stringify(this._scales, null, 2));
            console.log('config -> ' + JSON.stringify(this._config, null, 2));

            Object.keys(payload).forEach((attribut) => {
                console.log('New attribute');
                console.log(attribut);

                // If the attribut is an array
                if (Array.isArray(this._config[option][attribut])) {
                    console.log('config option is array');
                    if (Array.isArray(payload[attribut])) {
                        console.log('payload option is array');
                        // If this is a scale object merge using the uuid
                        if (Object.prototype.hasOwnProperty.call(this._scales, attribut)) {
                            console.log('scales has the attribute');
                            this._scales[attribut][payload[attribut][0].uuid] = payload[attribut][0];
                            this._config[option][attribut] = Object.values(this._scales[attribut]);
                        } else {
                            console.log('scales does not have the attribute');
                            // add the array to the current array
                            this._config[option][attribut].push(...payload[attribut]);
                        }
                    } else {
                        console.log('payload option not array');
                        // add the option
                        this._config[option][attribut].push(payload[attribut]);
                    }
                } else if (
                    // the attribut is an object we know
                    typeof this._config[option][attribut] === 'object' &&
                    this._config[option][attribut] !== null
                ) {
                    console.log('config option is object');
                    // merge it
                    this._config[option][attribut] = {
                        ...this._config[option][attribut],
                        ...payload[attribut],
                    };
                } else {
                    console.log('config option is else');
                    // the attribut is an object we don't know
                    // GR: WE SEEM TO BE ENDING UP ON THIS PATH WAY MORE THAN WE OUGHT TO BE

                    // Assign the attribute value to the config.
                    if (option === 'scales' && Array.isArray(payload[attribut]) && payload[attribut].length > 0) {
                        // If there isn't an object yet to store the scale config, create it
                        this._config[option][attribut] = !this._config[option][attribut]
                            ? {}
                            : this._config[option][attribut];
                        // store it by removing the value from the list
                        this._config[option][attribut][payload[attribut][0].uuid] = payload[attribut][0];
                    } else {
                        this._config[option][attribut] = payload[attribut]; // store it
                    }

                    // If this is a scale object with data, add it to the scales property.
                    // GR: I THINK THE SCALES PROPERTY MIGHT BE FOR ALIGNING SCALES TO DATASETS. THE CONFIG IS FOR RENDERING.
                    console.log('attribute: ' + attribut);
                    console.log('scales object: ' + JSON.stringify(this._scales, null, 2));
                    console.log('payload: ' + JSON.stringify(payload, null, 2));
                    console.log(
                        'scales object has the attribute: ' +
                            Object.prototype.hasOwnProperty.call(this._scales, attribut),
                    );
                    console.log('payload has a value to provide: ' + payload[attribut] !== undefined);
                    if (
                        Object.prototype.hasOwnProperty.call(this._scales, attribut) &&
                        payload[attribut] !== undefined
                    ) {
                        console.log('scales object has the attribute and the payload has a value to provide');
                        console.log(
                            'payload for attribute right before setting it -> ' +
                                JSON.stringify(payload[attribut][0], null, 2),
                        );

                        this._scales[attribut][payload[attribut][0].uuid] = payload[attribut][0];
                        console.log(
                            'scales after assigning the payload for attribute -> ' +
                                JSON.stringify(this._scales, null, 2),
                        );

                        // Also store the scale object in the config using the uuid. This was causing errors without having this line.
                        this._config[option][attribut][payload[attribut][0].uuid] = payload[attribut][0];

                        console.log(payload[attribut][0].uuid);
                        console.log(
                            'payload for attribute after scale processing -> ' +
                                JSON.stringify(payload[attribut], null, 2),
                        );
                        console.log('config after scale processing -> ' + JSON.stringify(this._config, null, 2));
                    }
                }
            });
        }
    }

    // make the object dirty and remove the option sent
    removeConfig(payload, option) {
        this._dirty = true;
        // In the scales case we need to remove the uuid related to the scale object
        if (option === ATTRIBUTE_CARTESIAN_AXES) {
            Object.keys(this._config[option])
                .filter((scale) => this._config[option][scale])
                .forEach((scale) => {
                    this._config[option][scale] = this._config[option][scale].filter(
                        (axis) => axis.uuid !== payload[scale][0].uuid,
                    );
                    this._scales[scale] = this._config[option][scale];
                });
        } else {
            // remove the option
            this._config[option] = undefined;
        }
    }

    // if dirty clean the object and store the cleaned version
    getConfig() {
        if (this._dirty) {
            this._cleanConfig = ChartConfigService.cleanObject(this._config);
            this._dirty = false;
        }
        return this._cleanConfig;
    }

    // Return a lightweight object without
    // - empty object
    // - empty array
    // - undefined attribute
    // do it recursively and store the result to avoid multiple times the same computation
    static cleanObject(obj) {
        const validObj = (o) => (Object.keys(o).length || (Array.isArray(o) && o.length)) && o;
        const itemToBool = (item) => {
            return typeof item !== 'object' || item === null
                ? item
                : // eslint-disable-next-line no-use-before-define
                  validObj(clean(item));
        };

        const clean = (o) =>
            validObj(
                Array.isArray(o)
                    ? o.map(itemToBool).filter(Boolean)
                    : Object.entries(o).reduce((a, [key, val]) => {
                          const newVal = itemToBool(val);
                          if (
                              // Here is the magic check null, undefined and type change (=> undefined recursively)
                              newVal !== undefined &&
                              newVal !== null &&
                              typeof val === typeof newVal
                          )
                              a[key] = newVal;
                          return a;
                      }, {}),
            );

        return clean(obj);
    }
}
