import { LightningElement, api } from 'lwc';

export default class extends LightningElement {
    @api label = 'Counters';

    counter = 0;

    increment() {
        this.counter++;
    }
    decrement() {
        this.counter--;
    }
}