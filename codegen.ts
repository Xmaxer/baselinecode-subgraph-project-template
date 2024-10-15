import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ['src/schema/schemaDefs/**/*.ts'],
  config: {
    typesPrefix: 'I',
    strictScalars: true,
    emitLegacyCommonJSImports: false,
    scalars: {
      _FieldSet: 'unknown',
    },
  },
  generates: {
    'src/generated/schema.mts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        defaultMapper: 'Partial<{T}>',
      },
    },
    'src/generated/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        federation: true,
        includeDirectives: true,
      },
    },
  },
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
};
export default config;
