import Navigo from 'navigo';
import { LightningElement, track } from 'lwc';

export default class App extends LightningElement {
    router = new Navigo('/', {
        noMatchWarning: true,
    });

    tabs = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            url: '/dashboard',
            class: 'slds-context-bar__item',
        },
        {
            key: 'metadata',
            label: 'Metadata',
            url: '/metadata',
            class: 'slds-context-bar__item',
        },
        {
            key: 'data',
            label: 'Data',
            url: '/data',
            class: 'slds-context-bar__item',
        },
        {
            key: 'documentation',
            label: 'Documentation',
            url: '/documentation',
            class: 'slds-context-bar__item',
        },
    ];

    @track view;

    constructor() {
        super();

        this.router.on({
            '/dashboard': async () => {
                const { default: ViewDashboard } = await import('view/dashboard');
                this.setView(ViewDashboard);
            },
            '/metadata': async () => {
                const { default: ViewMetadataOwners } = await import('view/metadataOwners');
                this.setView(ViewMetadataOwners);
            },
            '/metadata/:id': async ({ data: { id } }) => {
                const { default: ViewMetadataComponent } = await import('view/metadataComponent');
                this.setView(ViewMetadataComponent, {
                    cmpId: parseInt(id, 10),
                });
            },
            '/data': async () => {
                const { default: ViewDataSeeding } = await import('view/dataSeeding');
                this.setView(ViewDataSeeding);
            },
            '/documentation': async () => {
                const { default: ViewDocumentation } = await import('view/documentation');
                this.setView(ViewDocumentation);
            },
        });

        const navigateToDefault = () => {
            this.router.navigate('/dashboard');
        };

        this.router.notFound(navigateToDefault);
        this.router.on(navigateToDefault);

        this.router.resolve();
    }

    setView(component, props = {}) {
        console.log('Set View Invoked');
        this.view = {
            component,
            props,
        };
    }

    handleTabClick(event) {
        event.preventDefault();

        const href = event.currentTarget.getAttribute('href');
        this.router.navigate(href);

        this.template.querySelector('base-menu').close();
    }

    handleNavigateEvent(event) {
        const { path } = event.detail;
        this.router.navigate(path);
    }
}
