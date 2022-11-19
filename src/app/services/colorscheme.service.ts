import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ColorSchemeService {

    private renderer: Renderer2;
    private colorScheme: string = "";
    // Define prefix for clearer and more readable class names in scss files
    private colorSchemePrefix = 'color-scheme-';

    constructor(rendererFactory: RendererFactory2) {
        // Create new renderer from renderFactory, to make it possible to use renderer2 in a service
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    _detectPrefersColorScheme() {
        // Detect if prefers-color-scheme is supported
        if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
            // Set colorScheme to Dark if prefers-color-scheme is dark. Otherwise, set it to Light.
            this.colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            // If the browser does not support prefers-color-scheme, set the default to dark.
            this.colorScheme = 'dark';
        }
    }

    _setColorScheme(scheme: string) {
        this.colorScheme = scheme;
        // Save prefers-color-scheme to localStorage
        localStorage.setItem('prefers-color', scheme);
    }

    _getColorScheme() {
        const localStorageColorScheme = localStorage.getItem('prefers-color');
        // Check if any prefers-color-scheme is stored in localStorage
        if (localStorageColorScheme) {
            // Save prefers-color-scheme from localStorage
            this.colorScheme = localStorageColorScheme;
        } else {
            // If no prefers-color-scheme is stored in localStorage, try to detect OS default prefers-color-scheme
            this._detectPrefersColorScheme();
        }
    }

    load() {
        this._getColorScheme();
        this.renderer.addClass(document.body, this.colorSchemePrefix + this.colorScheme);
    }

    update(scheme: string) {
        this._setColorScheme(scheme);
        this.renderer.removeClass(document.body, this.colorSchemePrefix + (this.colorScheme === 'dark' ? 'light' : 'dark'));
        this.renderer.addClass(document.body, this.colorSchemePrefix + scheme);
    }

    currentActive() {
        return this.colorScheme;
    }

}