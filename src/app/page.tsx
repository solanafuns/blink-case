"use client";

import {
  MiniBlink,
  useAction,
  useActionsRegistryInterval,
} from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import "@dialectlabs/blinks/index.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { clusterApiUrl } from "@solana/web3.js";
import { Wallet } from "./wrapper";

function App() {
  useActionsRegistryInterval();

  const { adapter } = useActionSolanaWalletAdapter(clusterApiUrl("devnet"));
  const { action, isLoading } = useAction({
    url: "solana-action:https://dial.to/api/donate",
    // url: "solana-action:https://blink-case.vercel.app/api/actions/transfer-sol",
    adapter,
  });

  return (
    <Wallet>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex min-w-[400px] flex-col items-center">
          <h1 className="mb-4 text-center text-4xl font-bold">Mini Blinks</h1>
          <div className="mb-4 w-full">
            {isLoading || !action ? (
              <span>Loading</span>
            ) : (
              <MiniBlink
                selector={(currentAction) =>
                  currentAction.actions.find((a) => a.label === "Donate")!
                }
                action={action}
              />
            )}
          </div>
          <WalletMultiButton />
        </div>
      </div>
    </Wallet>
  );
}

export default App;
