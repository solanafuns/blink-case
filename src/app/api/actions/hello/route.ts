import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

export const GET = (req: Request) => {
  const payload: ActionGetResponse = {
    icon: new URL("/solana_devs.jpg", new URL(req.url).origin).toString(),
    title: "hello blink",
    description: "hello this is one blink example",
    label: "send memo",
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const body: ActionPostRequest = await req.json();
    console.log(body);
    let account: PublicKey;

    try {
      account = new PublicKey(body.account);
    } catch (error) {
      return new Response("invalid account provided: " + error, {
        status: 400,
      });
    }

    const transaction = new Transaction();

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000,
      }),
      new TransactionInstruction({
        programId: new PublicKey(account),
        data: Buffer.from(""),
        keys: [],
      })
    );
    transaction.feePayer = account;
    const connection = new Connection(clusterApiUrl("devnet"));
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "one blink example",
        type: "transaction",
      },
      signers: [],
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    return new Response("An unkonw error : " + error, { status: 400 });
  }
};
