export type ProviderMetaData = {
    /**
     * Le nom du service que l'on cherche à fournir
     * Par ex : "formatter"
     */
    provide: string;

    /**
     * Fonction qui retourne une instance du service que l'on cherche à fournir
     * Par ex : () => new Formatter
     */
    construct: Function;
};

export type ProvidersMetaData = ProviderMetaData[];

export type ServiceInstance = {
    /**
     * Le nom du service que l'on contient
     */
    name: string;

    /**
     * L'instance du service
     */
    instance: any;
};

export type ServicesInstances = ServiceInstance[];

export type Module = {
    /**
     * Le tableau qui doit contenir les classes de mes directives
     */
    declarations: any[];

    /**
     * Un tableau qui contient les définitions de services pour mes directives
     */
    providers?: ProvidersMetaData;
};

export type DirectiveMetaData = {
    /**
     * Le sélecteur CSS qui explique quels sont les éléments ciblés par cette directive
     */
    selector: string;

    /**
     * La liste des providers de la directive précise
     */
    providers?: ProvidersMetaData;
};
