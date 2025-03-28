declare module 'google-spreadsheet' {
  export class GoogleSpreadsheet {
    constructor(sheetId: string);
    useServiceAccountAuth(credentials: {
      client_email: string;
      private_key: string;
    }): Promise<void>;
    loadInfo(): Promise<void>;
    sheetsByIndex: GoogleSpreadsheetWorksheet[];
  }

  export class GoogleSpreadsheetWorksheet {
    addRow(row: Record<string, any>): Promise<GoogleSpreadsheetRow>;
    getRows(): Promise<GoogleSpreadsheetRow[]>;
  }

  export class GoogleSpreadsheetRow {
    get<T>(columnName: string): T;
    save(): Promise<void>;
    Name: string;
    Email: string;
    Progress: string | number;
    'Completion Date': string | null;
  }
} 