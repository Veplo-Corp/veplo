import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { OperationDefinitionNode, FieldDefinitionNode, Kind, NamedTypeNode, NonNullTypeNode, TypeNode, visit } from 'graphql';

export const removeMaybePlugin: PluginFunction = (schema, documents, config) => {
    const removeMaybeVisitor = {
        FieldDefinition: (node: FieldDefinitionNode) => {
            const typeNode = removeMaybeFromTypeNode(node.type);
            return {
                ...node,
                type: typeNode,
            };
        },
    };

    const removeMaybeFromTypeNode = (typeNode: TypeNode): TypeNode => {
        if (typeNode.kind === Kind.NAMED_TYPE) {
            return {
                ...typeNode,
            };
        } else if (typeNode.kind === Kind.NON_NULL_TYPE) {
            const namedTypeNode = removeMaybeFromTypeNode(typeNode.type);
            return {
                ...typeNode,
                type: namedTypeNode,
            };
        } else {
            return removeMaybeFromTypeNode(typeNode.type);
        }
    };

    const removeMaybeFromDocument = (document: OperationDefinitionNode) => {
        const updatedDocument = visit(document, removeMaybeVisitor);
        return updatedDocument;
    };

    const updatedDocuments = documents.map((document) => removeMaybeFromDocument(document));

    return {
        prepend: [],
        content: '',
        append: [],
        documents: updatedDocuments,
    };
};