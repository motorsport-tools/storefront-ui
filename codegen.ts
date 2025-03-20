import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      'https://odoo.motorsport-tools.co.uk/graphql/vsf': {},
    },
  ],
  config: {
    preResolveTypes: true,
    avoidOptionals: true,
    useTypeImports: true,
  },
  ignoreNoDocuments: true,
  generates: {
    './graphql/gql/': {
      documents: ['graphql/**/*.tsx'],
      preset: 'client',
      config: {
        preResolveTypes: true,
        avoidOptionals: true,
        useTypeImports: true,
      },
    },
  },
};

export default config;
