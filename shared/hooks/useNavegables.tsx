import { AcordionOptionsProps } from "../components/acordionOptions";
import AcordionOptionsContent from "../components/acordionOptionsContent";
import AcordionOptionsTitle from "../components/acordionOptionsTitle";

import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import AddIcon from "@mui/icons-material/Add";

interface useNavegablesProps {
  section: string;
  subsection: string;
  action: () => void;
}
export default function useNavegables(
  actions: useNavegablesProps[]
): AcordionOptionsProps[] {
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
          onClick={() =>
            actions
              .find(
                (a) => a.section === "trades" && a.subsection === "listTrades"
              )
              ?.action()
          }
        />,
        <AcordionOptionsContent
          key={"createTrade"}
          icon={<AddIcon />}
          title="Create new Trade"
          size={"md"}
          onClick={() =>
            actions
              .find(
                (a) => a.section === "trades" && a.subsection === "createTrade"
              )
              ?.action()
          }
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
          onClick={() =>
            actions
              .find(
                (a) => a.section === "rules" && a.subsection === "listRules"
              )
              ?.action()
          }
        />,
        <AcordionOptionsContent
          key={"createRule"}
          icon={<AddIcon />}
          size={"md"}
          title="Create new Rule"
          onClick={() =>
            actions
              .find(
                (a) => a.section === "rules" && a.subsection === "createRule"
              )
              ?.action()
          }
        />,
      ],
    },
  ];
}
