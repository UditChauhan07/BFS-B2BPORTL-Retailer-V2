import axios from "axios";
import { DestoryAuth, originAPi } from "../lib/store";

export const useComparisonReport = (props) => {
  return {
    fetchComparisonReportAPI: async ( {AccountId__c, month, year}) => {
      // console.log("props", ManufacturerId__c, month, year);
      const response = await axios.post(originAPi+"/9kJs2I6Bn/h6Gyzcu5TXCIdJ2", {
        month,
        year,
        AccountId__c
      });
      if (response.status == 300) {
        DestoryAuth();
      } else {
        return response.data;
      }
    },
  };
};
