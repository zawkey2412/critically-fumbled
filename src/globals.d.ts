declare global {
  const game: {
    settings: {
      register: (module: string, key: string, options: any) => void;
      get: (module: string, key: string) => any;
    };
    i18n: {
      localize: (key: string) => string;
    };
    modules: {
      get: (id: string) => { active: boolean } | undefined;
    };
    actors: {
      get: (id: string) => any;
    };
    user: {
      isGM: boolean;
      id: string;
    };
    users: any[];
    tables: {
      find: (predicate: (table: any) => boolean) => any;
      getName: (name: string) => any;
    };
  };

  const ui: {
    notifications: {
      info: (message: string) => void;
      warn: (message: string) => void;
      error: (message: string) => void;
    };
  };

  const Hooks: {
    once: (event: string, callback: Function) => void;
    on: (event: string, callback: Function) => void;
  };

  const ChatMessage: {
    getSpeaker: (options?: any) => any;
    create: (data: any) => Promise<any>;
  };

  const CONST: {
    CHAT_MESSAGE_TYPES: {
      OTHER: number;
    };
  };

  const RollTable: any;
  
  function fromUuid(uuid: string): Promise<any>;
}

export {};