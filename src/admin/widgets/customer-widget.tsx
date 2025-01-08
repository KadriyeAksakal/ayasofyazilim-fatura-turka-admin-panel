import { useEffect, useState } from "react";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { globalToken } from "./login-widget"; 
import { Badge } from "@medusajs/ui"
import { InformationCircle } from "@medusajs/icons"
import axios from "axios";
import { 
  DetailWidgetProps, 
  AdminProduct,
} from "@medusajs/framework/types"

const CustomerWidget = ({ 
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const customer = data.metadata;
  console.log("customer", customer);


    const fetchTaxpayerInfo = async () => {
      if (!customer || !globalToken) {
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.post(
          'https://uat.faturaturka.com/im/v2/api/Integration/GetGbpk',
          {
            Identifier: customer.id,
            IncludeAliases: false
          },
          {
            headers: {
              Authorization: `Bearer ${globalToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.status === 200) {
          console.log("response.data", response.data);
          if(response.data.EInvoiceUser){
            setIsVerified(true);
          }
        }
      } catch (error) {
        console.error('API isteği sırasında hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      fetchTaxpayerInfo();
    }, [customer]);
  

  return (
    <div>
      {/* <p className="text-center mt-4">
        {globalToken ? `Alınan Token: ${globalToken}` : "Henüz token alınmadı."}
      </p> */}

      {!loading && (
        <div className="mt-2">
         {isVerified && (
          <div className="mt-2 text-right">
            <Badge color="red" className="p-3"> <InformationCircle className="pr-2 w-6"/> E-Invoice Taxpayer</Badge>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "customer.details.before",
});

export default CustomerWidget;
