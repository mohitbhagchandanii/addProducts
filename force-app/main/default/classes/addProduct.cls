public class addProduct {
      @AuraEnabled
    public static List<PriceBookEntry> displayProductList() {
        
        return [SELECT unitPrice,PriceBook2.Name, PriceBook2Id, Product2.Id, Product2.Name, Product2.ProductCode, Product2.Description, 
                Product2.Family from PriceBookEntry ];
        
    }
    @AuraEnabled
    public static list<sObject> createProduct(String ac){
        List<sObject> newRecord=(List<sObject>)JSON.deserialize(ac, List<sObject>.class);
        insert newRecord;
        return newRecord;
        
    }
    @AuraEnabled
    public static List<OpportunityLineItem> displayPro() {
        return [SELECT  Product2.Name,UnitPrice, Id, Quantity, description, ServiceDate FROM OpportunityLineItem ];
    }
}