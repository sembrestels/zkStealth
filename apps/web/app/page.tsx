"use client"
import { useEffect, useState } from 'react';
  import { runExample } from "@repo/fluidkey-utils";

  export default function Page(): JSX.Element {
    const [results, setResults] = useState<{ nonce: bigint; stealthSafeAddress: string }[]>([]);

    useEffect(() => {
      async function fetchResults() {
        const exampleResults = await runExample();
        setResults(exampleResults);
      }
      fetchResults();
    }, []);

    return (
      <main>
        Hello Anon
        {results.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nonce</th>
                <th>Stealth Safe Address</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ nonce, stealthSafeAddress }) => (
                <tr key={nonce.toString()}>
                  <td>{nonce.toString()}</td>
                  <td>{stealthSafeAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    );
  }
