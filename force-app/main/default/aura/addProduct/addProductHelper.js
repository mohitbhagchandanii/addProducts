({    
    fetchProducts : function(component, event) {
        var action = component.get("c.displayProductList");
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                records.forEach(function(record) {
                    record.linkName = '/' + record.Id;
                    record.name=record.Product2.Name;
                    record.ProductCode=record.Product2.ProductCode;
                    record. Description=record.Product2.Description;
                    record.Family=record.Product2.Family;
                    
                    
                    record.CheckBool = false;
                });   
                component.set("v.PricebookEntryList", records);
                component.set("v.filteredEntryList", records);
                console.log(records);
            }                 
        });
        $A.enqueueAction(action);
    },
})
({
        displayProduct : function(component, event) {
        var action= component.get("c.displayPro");
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state == 'SUCCESS'){
                console.log(response.getReturnValue());
               
                 var records = response.getReturnValue();
                records.forEach(function(record) {
                    record.linkName = '/' + record.Id;
                    record.Name=record.Product2.Name;
                    //record.ProductCode=record.Product2.ProductCode;
                   // record.Description=record.Product2.Description;
                    //record.Family=record.Product2.Family;
                    
                    record.CheckBool = false;
                });   
                component.set("v.filteredEntryList",records);
            }
        });
        $A.enqueueAction(action);
    }
})