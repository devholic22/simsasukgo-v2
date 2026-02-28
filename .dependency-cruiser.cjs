/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: '순환 참조는 금지한다.',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'backend-libs-no-app-import',
      severity: 'error',
      comment: 'backend libs는 backend apps를 참조하면 안 된다.',
      from: {
        path: '^backend/libs',
      },
      to: {
        path: '^backend/apps',
      },
    },
    {
      name: 'backend-domain-no-upper-layer-import',
      severity: 'error',
      comment: 'backend domain은 다른 backend lib 계층을 참조하면 안 된다.',
      from: {
        path: '^backend/libs/domain',
      },
      to: {
        path: '^backend/libs/(common|outbound|places|routes)',
      },
    },
    {
      name: 'backend-common-no-feature-import',
      severity: 'error',
      comment: 'backend common은 feature/outbound 계층을 참조하면 안 된다.',
      from: {
        path: '^backend/libs/common',
      },
      to: {
        path: '^backend/libs/(outbound|places|routes)',
      },
    },
    {
      name: 'frontend-lib-no-ui-import',
      severity: 'error',
      comment: 'frontend lib은 UI 계층(app/components)을 참조하면 안 된다.',
      from: {
        path: '^frontend/lib',
      },
      to: {
        path: '^frontend/(app|components)',
      },
    },
    {
      name: 'frontend-components-no-app-import',
      severity: 'error',
      comment: 'frontend components는 app 계층을 참조하면 안 된다.',
      from: {
        path: '^frontend/components',
      },
      to: {
        path: '^frontend/app',
      },
    },
  ],
  options: {
    tsConfig: {
      fileName: 'tsconfig.base.json',
    },
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: '(^|/)(node_modules|dist|\\.next|coverage)(/|$)',
    },
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.d.ts'],
    },
  },
};
