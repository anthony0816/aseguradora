import { AcordionOptionsProps } from "../components/acordionOptions";
import AcordionOptionsContent from "../components/acordionOptionsContent";
import AcordionOptionsTitle from "../components/acordionOptionsTitle";

import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddIcon from "@mui/icons-material/Add";

interface useNavegablesProps {
  router: (pathname: string) => void;
}
export default function useNavegables({
  router,
}: useNavegablesProps): AcordionOptionsProps[] {
  return [
    {
      value: "Accounts",
      title: (
        <AcordionOptionsTitle
          icon={<AccountBalanceIcon />}
          size={"md"}
          title="Cuentas"
        />
      ),
      text: [
        <AcordionOptionsContent
          key={"listAccounts"}
          icon={<FormatListNumberedIcon />}
          size={"md"}
          title="Mis cuentas"
          onClick={() => router("/aseguradora/listAccounts")}
        />,
        <AcordionOptionsContent
          key={"createAccount"}
          icon={<AddIcon />}
          title="Crear cuenta"
          size={"md"}
          onClick={() => router("/aseguradora/createAccount")}
        />,
      ],
    },
    {
      value: "Trades",
      title: (
        <AcordionOptionsTitle
          icon={<SignalCellularAltIcon />}
          size={"md"}
          title="Trades"
        />
      ),
      text: [
        <AcordionOptionsContent
          key={"listTrades"}
          icon={<FormatListNumberedIcon />}
          size={"md"}
          title="Mis trades"
          onClick={() => router("/aseguradora/listTrades")}
        />,
        <AcordionOptionsContent
          key={"createTrade"}
          icon={<AddIcon />}
          title="Crear trade"
          size={"md"}
          onClick={() => router("/aseguradora/createTrade")}
        />,
      ],
    },
    {
      value: "Rules",
      title: (
        <AcordionOptionsTitle
          icon={<SquareFootIcon />}
          size={"md"}
          title="Reglas"
        />
      ),
      text: [
        <AcordionOptionsContent
          key={"listRules"}
          icon={<FormatListNumberedIcon />}
          size={"md"}
          title="Mis reglas"
          onClick={() => router("/aseguradora/listRules")}
        />,
        <AcordionOptionsContent
          key={"createRule"}
          icon={<AddIcon />}
          size={"md"}
          title="Crear regla"
          onClick={() => router("/aseguradora/createRule")}
        />,
      ],
    },
  ];
}
