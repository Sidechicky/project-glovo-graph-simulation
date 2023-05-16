import _ from 'lodash';


export const getEdgesWithIds = async (db_edges) => {
    const mkCounter = function*() {
        let i = 0;
        while (true) yield i++;
    };

    const transform = (apiEdges, assignNodeId, assignEdgeId) => {
        const nodes = _.chain(apiEdges)
            .flatMap(({ src, dst }) => [src, dst])
            .uniq()
            .sort()
            .map((name, i) => ({ i: assignNodeId(), name }))
            .value();
        const association = _.chain(nodes)
            .map((p) => [p.name, p.i])
            .fromPairs()
            .value();
        const edges = _.chain(apiEdges)
            .map((e, i) => {
                const s = association[e.src];
                const t = association[e.dst];
                const w = e.weight;
                return { i: assignEdgeId(), s, t, w, source: s, target: t };
            })
            .value();
        return { nodes, edges };
    };

    const nodeCounter = mkCounter();
    const edgeCounter = mkCounter();
    const assignNodeId = () => nodeCounter.next().value;
    const assignEdgeId = () => edgeCounter.next().value;

    return transform(db_edges, assignNodeId, assignEdgeId);
};