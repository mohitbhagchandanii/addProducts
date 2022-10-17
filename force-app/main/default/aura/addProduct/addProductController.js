({
    init : function(component, event, helper) {
        component.set('v.mycolumns', [
            {label: 'Product Name', fieldName: 'name', type: 'text'},
            {label: 'Product Code', fieldName: 'ProductCode', type: 'text'},
            {label: 'List Price', fieldName: 'UnitPrice', type: 'Price'},
            {label: 'Product Description', fieldName: 'Description', type: 'Text'},
            {label: 'Product Family', fieldName: 'Family', type: 'Text'}
        ]);
        component.set('v.mycolumns2', [
            {label: 'Product Name', fieldName: 'name', type: 'text'},
            {label: 'Quantity', fieldName: 'Quantity', type: 'text',editable: true ,typeAttributes: { required: true } },
            {label: 'Sales Price', fieldName: 'UnitPrice', type: 'Price'},
            {label: 'Date', fieldName: 'ServiceDate', type: 'Text', editable: true},
            {label: 'Line Description', fieldName: 'Description', type: 'Text', editable: true},
            {label: '', type: 'button', typeAttributes: { iconName :'utility:delete', name: 'Delete', title: 'Delete'}}
            
        ]);
        helper.fetchProducts(component, event);
        
    },
    
    updateSelectedText: function (component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        component.set('v.selectedRowsCount', selectedRows.length);
        
        var setRows = [];
        for ( var i = 0; i < selectedRows.length; i++ ) {
            setRows.push(selectedRows[i]);
        }
        component.set("v.selectedProducts", setRows);
    },
    
    showSelectedProduct : function(component, event, helper) {
        component.set("v.isModalOpen", 'true');
        component.set("v.isModalsOpen", 'false');
        
    },
    
    showSelectedProducts : function(component, event, helper) {
        component.set("v.isModalsOpen", 'true');
    },
    
    showSelectedData : function(component, event, helper) {
          component.set("v.isModalsOpen", 'false');
        component.set("v.isModalShow", 'true');
        component.set("v.isModalOpen", 'false');
     
    },
    
    
    
    searchKeyChange : function(component, event, helper) {
        let listNew = component.get("v.PricebookEntryList");
        if(event.target.value===''){
            component.set("v.filteredEntryList", listNew);
        }
        else{
            let filtered = listNew.filter( obj => obj.name.toLowerCase().includes(event.target.value.toLowerCase()));
            component.set("v.filteredEntryList", filtered);}
    },
    doDelete : function(component, event, helper) {
        var prodList = component.get("v.selectedProducts");
        var row = event.getParam('row')
        console.log(row);
        let filtered = prodList.filter( obj => obj.Id!=row.Id);
        component.set("v.selectedProducts", filtered);
    },
    
    doBack: function(component, event, helper) {
        // Set isModalOpen attribute to false 
        component.set("v.isModalOpen", false);
        component.set("v.isModalsOpen", 'true');
        component.set("v.isModalShow", 'false');
    },
    
    closeModel2: function(component, event, helper) {
        // Set isModalOpen attribute to false 
        component.set("v.isModalsOpen", false);
    },
    closeModal: function(component, event, helper) {
        // Set isModalOpen attribute to false 
        component.set("v.isModalShow", false);
        component.set("v.isModalOpen", false);
    },
    doSave : function(component, event, helper) {
        
        var prod=component.get('v.selectedProducts');
        
        var flag=true;
        console.log(component.get('v.selectedProducts'));
        let oppoLineItems = [];
        
        prod.forEach((obj,i)=>{
            let lineItem = {}
                     lineItem.attributes={"type":"OpportunityLineItem"};
                     lineItem.OpportunityId='0065i000007frpqAAA';
                     lineItem.Quantity=component.get('v.QuantityList')['row-'+i];
        lineItem.Product2Id=obj.Product2Id;
        lineItem.ProductCode=obj.ProductCode;
        lineItem.Name=obj.name;
        lineItem.UnitPrice= lineItem.Quantity*obj.UnitPrice;
        lineItem.Description=obj.Description;
        oppoLineItems.push(lineItem);
        console.log(lineItem.Quantity);
        console.log(component.get('v.QuantityList')['row-'+i]);
        if(lineItem.Quantity==undefined || lineItem.Quantity==null){
            flag=false;
        }
        
    })
    console.log(oppoLineItems);
    
    if(flag){
    var action = component.get('c.createProduct');
    action.setParams({
    ac : JSON.stringify(oppoLineItems)
});
action.setCallback(this,function(result){
    var state = result.getState();  
    console.log('state'+state);
    if (state === "SUCCESS") {
        var res = result.getReturnValue();
        delete prod.Id;
        prod.Name= '';
        prod.UnitPrice= '';
        prod.Quantity= '';
        prod.ServiceDate ='';
        prod.description ='';
        alert('Opportunity Product Successfully Saved');
        
        component.set('v.AddRecord',prod);
        helper.displayProduct(component,event);
    }
    var getAllValue = component.get('v.selectedProducts');
});
$A.enqueueAction(action);
component.set("v.isModalOpen", false);
component.set("v.isModalsOpen", false);
}
else{
    console.log("Inhales");
    var selectedProducts = component.get("v.selectedProducts");
      let arr=component.get('v.QuantityList') || {};
    console.log(selectedProducts);
    var errors = component.get("v.errors");
    if(errors==undefined || errors==null ){
        errors = { rows: {}, table: {} }
    } 
    for (var i=0; i<selectedProducts.length; i++)
    {
        console.log(selectedProducts[i].id);
        if(!(arr["row-"+i])){
               errors.rows["row-"+i] = { title: 'Testing Error1', 
                                               messages: ['Testing Error amount','Testing Error Email'],
                                               fieldNames: ['Quantity']}; 
        
        }
     
        console.log(errors.rows[selectedProducts[i].Id]);
        
    }
   
    
    
    errors.table.title = "We found 2 error(s). ...";
    errors.table.messages = ['Testing Error amount','Testing Error Email'];
    component.set("v.errors", errors);
   
    
}
},
    
    handleSuccess: function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    },
        handlecellchange:function(component, event, helper) {
            var errors = component.get("v.errors");
            
   
         errors = { rows: {}, table: {} };
         component.set("v.errors", errors);
    
            console.log('-----');
            console.log(event.getParam("draftValues"));
            let arr=component.get('v.QuantityList') || {};
            arr[event.getParam("draftValues")[0].id]=event.getParam("draftValues")[0].Quantity;
            component.set('v.QuantityList',arr);
            console.log(component.get('v.QuantityList')['row-0']);
            
        }
})