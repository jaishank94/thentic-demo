import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/Home.module.css";

const API_KEY = "O3vBADmTxqvcvJm7umIrhn5eyMERUulf";

export default function Home() {
  const router = useRouter();
  const [chain, setChain] = useState(1);
  const [toAddress, setToAddress] = useState("");
  const [price, setPrice] = useState(0);
  const [invoice, setInvoice] = useState("");
  const [isSaving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (price <= 0) {
      alert(
        "Please fill all the required fields and the amount must not be less than or equal to zero "
      );
      setSaving(false);
      return;
    }

    const postData = {
      key: API_KEY,
      chain_id: chain,
      to: toAddress,
      amount: price,
    };

    try {
      let sData = await fetch("https://thentic.tech/api/invoices/new", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!sData.ok) {
        const message = `An error has occured: ${sData.status} - ${sData.statusText}`;
        throw new Error(message);
      }
      const sInfo = await sData.json();

      console.log("sInfo", sInfo);
      setInvoice(sInfo);
      setSaving(false);
      alert(
        `Successfully created invoice. Your request ID - ${sInfo.request_id} and status - ${sInfo.status}`
      );
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("Something went wrong!");
    }
  };

  const handleGenerateAddress = async () => {
    const postData = {
      key: API_KEY,
    };

    try {
      const kData = await fetch("https://thentic.tech/api/wallets/new", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!kData.ok) {
        const message = `An error has occured: ${kData.status} - ${kData.statusText}`;
        throw new Error(message);
      }
      const wData = await kData.json();

      setToAddress(wData.wallet);
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("Something went wrong!");
    }
  };

  const handleReset = async () => {
    setChain(1);
    setToAddress("");
    setPrice(0);
    setInvoice("");
  };
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Head>
        <title>Thentic Test Dapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col">
        <form onSubmit={onSubmit}>
          <h1 className="text-2xl my-4">Welcome to Invoice Generator</h1>
          <div>
            <label className="text-sm font-medium text-gray-400 dark:text-gray-500">
              Chain ID
            </label>
            <input
              type="number"
              className="border-[1px] p-2 text-lg border-black w-full"
              placeholder="Chain ID"
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              maxLength="50"
              required
            />
          </div>
          <div className="mt-3">
            <label className="text-sm mr-2 font-medium text-gray-400 dark:text-gray-500">
              To Address
            </label>
            (
            <a
              onClick={() => handleGenerateAddress()}
              className="cursor-pointer hover:text-sky-500"
            >
              Generat Random Address
            </a>
            )
            <input
              type="text"
              className="border-[1px] p-2 text-lg border-black w-full"
              placeholder="To Address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <label className="text-sm font-medium text-gray-400 dark:text-gray-500">
              Amount (ETH)
            </label>
            <input
              type="number"
              className="border-[1px] p-2 text-lg border-black w-full"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`mt-5 w-full p-5 bg-green-700 text-white text-lg rounded-xl ${
              isSaving && "animate-pulse"
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Creating..." : "Create now"}
          </button>
        </form>
        <a
          onClick={() => {
            handleReset();
          }}
          className="text-center my-2 cursor-pointer"
        >
          Reset
        </a>
        <div>
          {invoice !== "" ? (
            <div className="border-0 my-4 rounded-lg bg-teal-200 p-2 text-gray-600">
              Invoice URL :{" "}
              <a
                href={invoice.transaction_url}
                target="_blank"
                className="underline"
              >
                {invoice.transaction_url}
              </a>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
