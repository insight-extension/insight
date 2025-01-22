export const TRANSLATIONS = {
  unexpectedError:
    "Something went wrong. Please reload the page and try again.",
  verifyAccountError:
    "Failed to verify account. Please reload the page and try again.",
  createSignatureError:
    "Failed to create signature. Please reload the page and try again.",

  depositModal: {
    trigger: "Deposit"
  },
  depositForm: {
    validation: {
      amount: {
        minimum: "Amount must be positive",
        maximum: "Sorry, we can't proceed that amount yet"
      },
      token: {
        required: "Please select a currency token"
      },
      subscriptionType: {
        required: "Please select a subscription type"
      }
    },
    toast: {
      successfulTransactionTitle: "Successful transaction",
      successfulTransactionDescription: "Your transaction has been processed",
      transactionFailedTitle: "Transaction failed",
      transactionFailedDescription:
        "Could not process your transaction, please try again",
      successfulAirDropTitle: "Successful airdrop",
      successfulAirDropDescription: "1 SOL has been airdropped to your account"
    },
    fields: {
      subscription: {
        perMonth: "Per month",
        perUsage: "Per usage",
        freeTrial: "Free trial",
        select: "Select"
      },
      token: {
        select: "Select"
      },
      amount: {
        label: "Amount"
      }
    },
    states: {
      validating: "Validating...",
      submit: "Submit",
      submitting: "..."
    },
    info: {
      balance: "Your balance"
    }
  }
};
