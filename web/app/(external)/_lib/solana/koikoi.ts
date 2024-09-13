export const IDL: Koikoi = {
  address: "3rFegxqcbnmjEKBmZRQbz9CZkVDVLtcL8Hh2qhozyyzc",
  metadata: {
    name: "koikoi",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "closeGame",
      discriminator: [237, 236, 157, 201, 253, 20, 248, 67],
      accounts: [
        {
          name: "koikoi",
        },
        {
          name: "game",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 97, 109, 101],
              },
              {
                kind: "arg",
                path: "identifier",
              },
            ],
          },
        },
        {
          name: "service",
          writable: true,
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "identifier",
          type: "string",
        },
        {
          name: "winOption",
          type: "u8",
        },
      ],
    },
    {
      name: "createSpendingAccount",
      discriminator: [68, 175, 147, 51, 110, 235, 245, 201],
      accounts: [
        {
          name: "koikoi",
        },
        {
          name: "spending",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 112, 101, 110, 100, 105, 110, 103],
              },
              {
                kind: "arg",
                path: "identifier",
              },
            ],
          },
        },
        {
          name: "service",
          writable: true,
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
        {
          name: "user",
          signer: true,
        },
      ],
      args: [
        {
          name: "identifier",
          type: "string",
        },
        {
          name: "owner",
          type: "pubkey",
        },
      ],
    },
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "koikoi",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [107, 111, 105, 107, 111, 105],
              },
            ],
          },
        },
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "makeGame",
      discriminator: [181, 126, 191, 203, 139, 196, 172, 247],
      accounts: [
        {
          name: "koikoi",
        },
        {
          name: "game",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 97, 109, 101],
              },
              {
                kind: "arg",
                path: "identifier",
              },
            ],
          },
        },
        {
          name: "service",
          writable: true,
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "identifier",
          type: "string",
        },
        {
          name: "options",
          type: "u8",
        },
      ],
    },
    {
      name: "placeBet",
      discriminator: [222, 62, 67, 220, 63, 166, 126, 33],
      accounts: [
        {
          name: "koikoi",
        },
        {
          name: "spending",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 112, 101, 110, 100, 105, 110, 103],
              },
              {
                kind: "arg",
                path: "userIdentifier",
              },
            ],
          },
        },
        {
          name: "game",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 97, 109, 101],
              },
              {
                kind: "arg",
                path: "gameIdentifier",
              },
            ],
          },
        },
        {
          name: "service",
          writable: true,
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
        {
          name: "signer",
          writable: true,
          signer: true,
        },
      ],
      args: [
        {
          name: "gameIdentifier",
          type: "string",
        },
        {
          name: "userIdentifier",
          type: "string",
        },
        {
          name: "option",
          type: "u8",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "updateConfig",
      discriminator: [29, 158, 252, 191, 10, 83, 219, 99],
      accounts: [
        {
          name: "koikoi",
          writable: true,
        },
        {
          name: "signer",
          signer: true,
        },
      ],
      args: [
        {
          name: "newAdmin",
          type: "pubkey",
        },
        {
          name: "newWithdrawFee",
          type: "u32",
        },
        {
          name: "newGameFee",
          type: "u32",
        },
      ],
    },
    {
      name: "updateSpendingAccountOwner",
      discriminator: [193, 207, 201, 168, 201, 29, 56, 190],
      accounts: [
        {
          name: "koikoi",
        },
        {
          name: "spending",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 112, 101, 110, 100, 105, 110, 103],
              },
              {
                kind: "arg",
                path: "identifier",
              },
            ],
          },
        },
        {
          name: "signer",
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "identifier",
          type: "string",
        },
        {
          name: "newOwner",
          type: "pubkey",
        },
      ],
    },
    {
      name: "withdrawFromSpendingAccount",
      discriminator: [80, 12, 194, 107, 167, 54, 60, 228],
      accounts: [
        {
          name: "koikoi",
        },
        {
          name: "spending",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 112, 101, 110, 100, 105, 110, 103],
              },
              {
                kind: "arg",
                path: "identifier",
              },
            ],
          },
        },
        {
          name: "receiver",
          writable: true,
        },
        {
          name: "feeReceiver",
          writable: true,
        },
        {
          name: "signer",
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "identifier",
          type: "string",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "koikoiAccount",
      discriminator: [118, 96, 27, 105, 187, 128, 164, 217],
    },
    {
      name: "spendingAccount",
      discriminator: [86, 52, 187, 170, 249, 148, 170, 228],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "invalidWinOption",
      msg: "Invalid win option",
    },
    {
      code: 6001,
      name: "distributionNotCompleted",
      msg: "Distribution is not completed",
    },
  ],
  types: [
    {
      name: "koikoiAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "admin",
            type: "pubkey",
          },
          {
            name: "withdrawFee",
            type: "u32",
          },
          {
            name: "gameFee",
            type: "u32",
          },
        ],
      },
    },
    {
      name: "spendingAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "pubkey",
          },
          {
            name: "koikoi",
            type: "pubkey",
          },
        ],
      },
    },
  ],
};

export type Koikoi = {
  address: "3rFegxqcbnmjEKBmZRQbz9CZkVDVLtcL8Hh2qhozyyzc";
  metadata: {
    name: "koikoi";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "closeGame";
      discriminator: [237, 236, 157, 201, 253, 20, 248, 67];
      accounts: [
        {
          name: "koikoi";
        },
        {
          name: "game";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 97, 109, 101];
              },
              {
                kind: "arg";
                path: "identifier";
              }
            ];
          };
        },
        {
          name: "service";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "identifier";
          type: "string";
        },
        {
          name: "winOption";
          type: "u8";
        }
      ];
    },
    {
      name: "createSpendingAccount";
      discriminator: [68, 175, 147, 51, 110, 235, 245, 201];
      accounts: [
        {
          name: "koikoi";
        },
        {
          name: "spending";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 112, 101, 110, 100, 105, 110, 103];
              },
              {
                kind: "arg";
                path: "identifier";
              }
            ];
          };
        },
        {
          name: "service";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "user";
          signer: true;
        }
      ];
      args: [
        {
          name: "identifier";
          type: "string";
        },
        {
          name: "owner";
          type: "pubkey";
        }
      ];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "koikoi";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [107, 111, 105, 107, 111, 105];
              }
            ];
          };
        },
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "makeGame";
      discriminator: [181, 126, 191, 203, 139, 196, 172, 247];
      accounts: [
        {
          name: "koikoi";
        },
        {
          name: "game";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 97, 109, 101];
              },
              {
                kind: "arg";
                path: "identifier";
              }
            ];
          };
        },
        {
          name: "service";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "identifier";
          type: "string";
        },
        {
          name: "options";
          type: "u8";
        }
      ];
    },
    {
      name: "placeBet";
      discriminator: [222, 62, 67, 220, 63, 166, 126, 33];
      accounts: [
        {
          name: "koikoi";
        },
        {
          name: "spending";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 112, 101, 110, 100, 105, 110, 103];
              },
              {
                kind: "arg";
                path: "userIdentifier";
              }
            ];
          };
        },
        {
          name: "game";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 97, 109, 101];
              },
              {
                kind: "arg";
                path: "gameIdentifier";
              }
            ];
          };
        },
        {
          name: "service";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "signer";
          writable: true;
          signer: true;
        }
      ];
      args: [
        {
          name: "gameIdentifier";
          type: "string";
        },
        {
          name: "userIdentifier";
          type: "string";
        },
        {
          name: "option";
          type: "u8";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "updateConfig";
      discriminator: [29, 158, 252, 191, 10, 83, 219, 99];
      accounts: [
        {
          name: "koikoi";
          writable: true;
        },
        {
          name: "signer";
          signer: true;
        }
      ];
      args: [
        {
          name: "newAdmin";
          type: "pubkey";
        },
        {
          name: "newWithdrawFee";
          type: "u32";
        },
        {
          name: "newGameFee";
          type: "u32";
        }
      ];
    },
    {
      name: "updateSpendingAccountOwner";
      discriminator: [193, 207, 201, 168, 201, 29, 56, 190];
      accounts: [
        {
          name: "koikoi";
        },
        {
          name: "spending";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 112, 101, 110, 100, 105, 110, 103];
              },
              {
                kind: "arg";
                path: "identifier";
              }
            ];
          };
        },
        {
          name: "signer";
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "identifier";
          type: "string";
        },
        {
          name: "newOwner";
          type: "pubkey";
        }
      ];
    },
    {
      name: "withdrawFromSpendingAccount";
      discriminator: [80, 12, 194, 107, 167, 54, 60, 228];
      accounts: [
        {
          name: "koikoi";
        },
        {
          name: "spending";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 112, 101, 110, 100, 105, 110, 103];
              },
              {
                kind: "arg";
                path: "identifier";
              }
            ];
          };
        },
        {
          name: "receiver";
          writable: true;
        },
        {
          name: "feeReceiver";
          writable: true;
        },
        {
          name: "signer";
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "identifier";
          type: "string";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "koikoiAccount";
      discriminator: [118, 96, 27, 105, 187, 128, 164, 217];
    },
    {
      name: "spendingAccount";
      discriminator: [86, 52, 187, 170, 249, 148, 170, 228];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidWinOption";
      msg: "Invalid win option";
    },
    {
      code: 6001;
      name: "distributionNotCompleted";
      msg: "Distribution is not completed";
    }
  ];
  types: [
    {
      name: "koikoiAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "withdrawFee";
            type: "u32";
          },
          {
            name: "gameFee";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "spendingAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "koikoi";
            type: "pubkey";
          }
        ];
      };
    }
  ];
};
