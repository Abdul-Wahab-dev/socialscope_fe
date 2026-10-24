import { legalConfig as L } from "@/config/legal";

/** The same operator contact block on the Privacy Policy and Terms, so the details always match. */
export function LegalContact() {
  return (
    <p>
      <strong>{L.companyName}</strong>
      <br />
      {L.address || L.location}
      <br />
      Privacy and data requests:{" "}
      <a href={`mailto:${L.privacyEmail}`}>{L.privacyEmail}</a>
      <br />
      Support and legal notices:{" "}
      <a href={`mailto:${L.supportEmail}`}>{L.supportEmail}</a>
    </p>
  );
}

/** "operated by X, based in Y" — uses the full address only when one is configured */
export const operatorLine = () =>
  `${L.companyName}, ${L.address || `based in ${L.location}`}`;
