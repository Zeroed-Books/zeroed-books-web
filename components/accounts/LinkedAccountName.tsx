import React, { useMemo } from "react";
import TextLink from "../TextLink";

interface Props {
  account: string;
}

export default function LinkedAccountName({ account }: Props) {
  const pieces = useMemo(() => {
    let soFar = "";

    return account.split(":").map((piece) => {
      if (soFar === "") {
        soFar = piece;
      } else {
        soFar += `:${piece}`;
      }

      return {
        name: piece,
        href: `/application/accounts/${soFar}`,
      };
    });
  }, [account]);

  return (
    <>
      {pieces.map((piece, index) => (
        <React.Fragment key={piece.href}>
          {index !== 0 && (
            <>
              :<wbr />
            </>
          )}
          <TextLink href={piece.href}>{piece.name}</TextLink>
        </React.Fragment>
      ))}
    </>
  );
}
