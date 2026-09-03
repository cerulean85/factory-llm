export interface ISeeder {
    setupInitialData(insertDebugData : boolean): Promise<void>
    insertTestData(): Promise<void>;
    insertDefaultData(): Promise<void>;
  }