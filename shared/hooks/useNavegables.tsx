import { AcordionOptionsProps } from "../components/acordionOptions";
import AcordionOptionsContent from "../components/acordionOptionsContent";
import AcordionOptionsTitle from "../components/acordionOptionsTitle";

import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import AddIcon from "@mui/icons-material/Add";

interface useNavegablesProps {
  router: (pathname: string) => void;
}
export default function useNavegables({
  router,
}: useNavegablesProps): AcordionOptionsProps[] {
  return [
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
          title="list trades"
          onClick={() => router("/aseguradora/listTrades")}
        />,
        <AcordionOptionsContent
          key={"createTrade"}
          icon={<AddIcon />}
          title="Create new Trade"
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
          title="Rules"
        />
      ),
      text: [
        <AcordionOptionsContent
          key={"listRules"}
          icon={<FormatListNumberedIcon />}
          size={"md"}
          title="list rules"
          onClick={() => router("/aseguradora/listRules")}
        />,
        <AcordionOptionsContent
          key={"createRule"}
          icon={<AddIcon />}
          size={"md"}
          title="Create new Rule"
          onClick={() => router("/aseguradora/createRule")}
        />,
      ],
    },
  ];
}
