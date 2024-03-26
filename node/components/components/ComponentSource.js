class ComponentSource {
    static get metas() {
        return {
            name: this.name,
        };
    }
    static list(args) {
        return {
            source: {
                name: 'Error',
            },
            components: {},
        };
    }
}
// @ts-ignore
ComponentSource.name = 'Unimplementedsource';
export default ComponentSource;
//# sourceMappingURL=ComponentSource.js.map