# Unit Tests Workflow Diagram

This diagram visualizes the `unit-tests.yml` workflow that fulfills **GitHub Actions Requirement 1** (Unit Tests with Artifacts).

## Mermaid Flow Diagram

```mermaid
graph TD
    %% Trigger Events
    A[Triggers: Push to main/develop, PR to main] --> B[Unit Tests and Coverage Workflow]
    
    %% Job with Matrix Strategy
    B --> C[Job: test<br/>runs-on: ubuntu-latest<br/>🔄 Matrix Strategy]
    C --> C1[Matrix: Node.js 18.x]
    C --> C2[Matrix: Node.js 20.x]
    
    %% Steps for Node 18.x
    C1 --> D1[1. Checkout code]
    D1 --> D2[2. Setup test environment<br/>🎯 CUSTOM ACTION<br/>./.github/actions/setup-test-env<br/>with: node-version 18.x]
    D2 --> D3[3. Run unit tests with coverage<br/>🧪 npm run test:coverage]
    D3 --> D4[4. Upload test results<br/>📦 ARTIFACTS (Requirement 1)<br/>• test-results/<br/>• coverage/]
    
    %% Steps for Node 20.x
    C2 --> E1[1. Checkout code]
    E1 --> E2[2. Setup test environment<br/>🎯 CUSTOM ACTION<br/>./.github/actions/setup-test-env<br/>with: node-version 20.x]
    E2 --> E3[3. Run unit tests with coverage<br/>🧪 npm run test:coverage]
    E3 --> E4[4. Upload test results<br/>📦 ARTIFACTS (Requirement 1)<br/>• test-results/<br/>• coverage/]
    
    %% Artifacts Output
    D4 --> ART1[Artifact: test-results-node-18.x<br/>📂 JUnit XML + Coverage<br/>⏱️ 30 days retention]
    E4 --> ART2[Artifact: test-results-node-20.x<br/>📂 JUnit XML + Coverage<br/>⏱️ 30 days retention]
    
    %% Custom Action Usage
    D2 -.-> CA[Custom Action<br/>setup-test-env<br/>🎯 Requirement 3]
    E2 -.-> CA
    
    %% Styling
    classDef triggerNode fill:#e1f5fe
    classDef jobNode fill:#f3e5f5
    classDef matrixNode fill:#e8f5e8
    classDef stepNode fill:#e8f5e8
    classDef artifactNode fill:#fff3e0
    classDef externalNode fill:#fce4ec
    
    class A triggerNode
    class C jobNode
    class C1,C2 matrixNode
    class D1,D2,D3,D4,E1,E2,E3,E4 stepNode
    class ART1,ART2 artifactNode
    class CA externalNode
```

## ASCII Flow Diagram (Alternative)

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIT TESTS & COVERAGE WORKFLOW              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
    ┌─────────────────────▼────────────────────────┐
    │   TRIGGERS: push (main/develop), PRs         │
    └─────────────────────┬────────────────────────┘
                          │
                          ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    JOB: test                               │
    │                  (ubuntu-latest)                           │
    │              🔄 MATRIX STRATEGY                            │
    └─────────────┬───────────────────────────┬───────────────────┘
                  │                           │
                  ▼                           ▼
    ┌─────────────────────────┐    ┌─────────────────────────┐
    │   MATRIX: Node.js 18.x  │    │   MATRIX: Node.js 20.x  │
    └─────────┬───────────────┘    └───────────┬─────────────┘
              │                                │
              ▼                                ▼
    ┌─────────────────────────┐    ┌─────────────────────────┐
    │  1. ✅ Checkout code    │    │  1. ✅ Checkout code    │
    │                         │    │                         │
    │  2. 🎯 Setup test env   │    │  2. 🎯 Setup test env   │
    │     (CUSTOM ACTION)     │    │     (CUSTOM ACTION)     │
    │     node-version: 18.x  │    │     node-version: 20.x  │
    │                         │    │                         │
    │  3. 🧪 Run unit tests   │    │  3. 🧪 Run unit tests   │
    │     with coverage       │    │     with coverage       │
    │                         │    │                         │
    │  4. 📦 Upload artifacts │    │  4. 📦 Upload artifacts │
    │     (REQUIREMENT 1)     │    │     (REQUIREMENT 1)     │
    │     • test-results/     │    │     • test-results/     │
    │     • coverage/         │    │     • coverage/         │
    └─────────┬───────────────┘    └───────────┬─────────────┘
              │                                │
              ▼                                ▼
    ┌─────────────────────────┐    ┌─────────────────────────┐
    │   📂 ARTIFACT OUTPUT    │    │   📂 ARTIFACT OUTPUT    │
    │                         │    │                         │
    │ Name: test-results-     │    │ Name: test-results-     │
    │       node-18.x         │    │       node-20.x         │
    │                         │    │                         │
    │ Contents:               │    │ Contents:               │
    │ • test-results/         │    │ • test-results/         │
    │   └── junit.xml         │    │   └── junit.xml         │
    │ • coverage/             │    │ • coverage/             │
    │   ├── html reports      │    │   ├── html reports      │
    │   └── lcov.info         │    │   └── lcov.info         │
    │                         │    │                         │
    │ Retention: 30 days      │    │ Retention: 30 days      │
    └─────────────────────────┘    └─────────────────────────┘
```

## Parallel Execution Flow

```
START
  │
  ├─── Node 18.x ───┐
  │                 │
  │   1. Checkout   │
  │   2. Setup      │     📦 Artifacts:
  │   3. Test       │ ──► test-results-node-18.x
  │   4. Upload     │     (30 days retention)
  │                 │
  └─── Node 20.x ───┤
                    │
      1. Checkout   │
      2. Setup      │     📦 Artifacts:
      3. Test       │ ──► test-results-node-20.x
      4. Upload     │     (30 days retention)
                    │
                   END
```

## Key Workflow Features

### 🎯 Requirement Fulfillment

1. **Unit Tests with Artifacts** (Requirement 1):
   - Runs comprehensive unit tests with coverage
   - Generates JUnit XML reports (`test-results/junit.xml`)
   - Creates HTML and LCOV coverage reports
   - Uploads as artifacts with 30-day retention
   - Always uploads artifacts, even if tests fail

2. **Custom Action Usage** (Requirement 3):
   - Uses `./.github/actions/setup-test-env` for setup
   - Demonstrates reusable workflow components
   - Passes matrix variables to custom action

### 🔄 Matrix Strategy

- **Parallel Execution**: Tests run simultaneously on Node.js 18.x and 20.x
- **Independent Artifacts**: Each matrix job creates separate artifacts
- **Consistent Steps**: Both matrix jobs run identical steps

### 📊 Artifacts and Reports

#### Primary Artifacts (Requirement 1):
- **test-results-node-18.x**: JUnit XML + coverage for Node 18.x
- **test-results-node-20.x**: JUnit XML + coverage for Node 20.x
- **Retention**: 30 days (viewable in Actions tab)

### 🎪 Conditional Logic

- **Always Upload**: Artifacts upload even if tests fail (`if: always()`)

### 🔍 Verification Steps

1. **View Artifacts**: Actions tab → Workflow run → Artifacts section
2. **Download Reports**: Click artifact names to download ZIP files

This workflow perfectly demonstrates the artifact storage requirement while showcasing matrix strategies for testing across multiple Node.js versions!
