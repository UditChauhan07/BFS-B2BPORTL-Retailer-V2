import axios from "axios";
import { DestoryAuth, originAPi } from "../lib/store";
import { useAuth } from "../context/UserContext";

const useSalesReport = () => {
  const { user, isUserLoading } = useAuth();
  return {
    salesReportData: async ({ yearFor }) => {
      let reportUrl = originAPi+"/uBUAQkaqEISRPAv/R11RNaniUMbA3qn";
      const response = await axios.post(
        reportUrl,
        {
          accountId:user?.data?.accountId,
          key:user?.data?.x_access_token,
          yearFor: yearFor
        }
      );
      if (response.status == 300) {
        DestoryAuth();
      } else {
        return response;
      }
    },
  };
};

export default useSalesReport;
