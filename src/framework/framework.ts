import { set } from "lodash";
import { Module, ProvidersMetaData, ServicesInstances } from "./types";
import { Detector } from "./change-detector";
import { NgZone } from "./zone";

export class Framework {
    /**
     * Le tableau qui recense l'ensemble des directives déclarées par mes collègues dans le projet
     */
    directives: any[] = [];

    /**
     * Le tableau qui contient les instances de services déjà construites (pour ne pas avoir à les reconstruire indéfiniment)
     */
    services: ServicesInstances = [];

    /**
     * Le tableau qui contientg les définitions de mes services (comment on construit tel ou tel service)
     */
    providers: ProvidersMetaData = [];

    /**
     * Le traitement qui va instancier les directives et les greffer aux elements HTML ciblés par les sélecteurs CSS
     */
    bootstrapApplication(metadata: Module) {
        this.providers = metadata.providers || [];
        this.directives = metadata.declarations;

        NgZone.run(() => {
            this.directives.forEach((directive) => {
                const elements = document.querySelectorAll<HTMLElement>(
                    directive.selector
                );

                elements.forEach((element) => {
                    const params = this.analyseDirectiveConstructor(
                        directive,
                        element
                    );
                    const directiveInstance: any = Reflect.construct(
                        directive,
                        params
                    );

                    const proxy = new Proxy(directiveInstance, {
                        set(target, propName: string, value, proxy) {
                            target[propName] = value;

                            if (!target.bindings) {
                                return true;
                            }

                            const binding = target.bindings.find(
                                (b) => b.propName === propName
                            );

                            if (!binding) {
                                return true;
                            }

                            Detector.addBinding(
                                element,
                                binding.attrName,
                                value
                            );

                            set(target.element, binding.attrName, value);

                            return true;
                        },
                    });
                    proxy.init();
                });
            });
        });
    }

    /**
     * Permet d'analyser les besoins d'un constructeur et de créer les instances nécessaires (les dépendances)
     *
     * @param directive La classe de la directive à instancier
     * @param element L'élément HTML sur lequel on veut greffer la directive
     * @returns LE tableau de paramètres nécessaire pour instancier ma directive
     */
    private analyseDirectiveConstructor(directive, element: HTMLElement) {
        const hasConstructor = /constructor\(.*\)/g.test(directive.toString());

        if (!hasConstructor) {
            return [];
        }

        const paramNames = this.extractParamsNamesFromDirective(directive);
        const params = paramNames.map((name) => {
            if (name === "element") {
                return element;
            }

            const directiveProviders = directive.providers || [];
            const directiveProvider = directiveProviders.find(
                (p) => p.provide === name
            );

            if (directiveProvider) {
                const instance = directiveProvider.construct();
                return instance;
            }

            const service = this.services.find((s) => s.name === name);
            const provider = this.providers.find((p) => p.provide === name);

            if (service) {
                return service.instance;
            }

            if (!provider) {
                throw new Error(
                    "Aucun fournisseur n'existe pour le service " + name
                );
            }

            const instance = provider.construct();

            this.services.push({
                name,
                instance,
            });

            return instance;
        });

        return params;
    }

    /**
     * Extrait les noms des paramètres du constructeur d'une directive
     *
     * @param directive La directive dont je veux connaître les paramètres
     * @returns Un tableau avec les noms des paramètres du constructeur
     */
    private extractParamsNamesFromDirective(directive) {
        const params = /constructor\((.*)\)/g.exec(directive.toString());
        if (!params) {
            return [];
        }

        return params[1].split(", ");
    }
}

export const Angular = new Framework();
