var sampleJSONSchema_Module_Factory = function () {
  var sampleJSONSchema = {
    name: 'sampleJSONSchema',
    typeInfos: [{
        localName: 'StudentType',
        propertyInfos: [{
            name: 'firstname',
            required: true,
            elementName: {
              localPart: 'firstname'
            }
          }, {
            name: 'lastname',
            required: true,
            elementName: {
              localPart: 'lastname'
            }
          }, {
            name: 'nickname',
            required: true,
            elementName: {
              localPart: 'nickname'
            }
          }, {
            name: 'marks',
            required: true,
            elementName: {
              localPart: 'marks'
            },
            typeInfo: 'PositiveInteger'
          }, {
            name: 'rollno',
            typeInfo: 'PositiveInteger',
            attributeName: {
              localPart: 'rollno'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Class',
        typeName: null,
        propertyInfos: [{
            name: 'student',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'student'
            },
            typeInfo: '.StudentType'
          }]
      }],
    elementInfos: [{
        typeInfo: '.Class',
        elementName: {
          localPart: 'class'
        }
      }]
  };
  return {
    sampleJSONSchema: sampleJSONSchema
  };
};
if (typeof define === 'function' && define.amd) {
  define([], sampleJSONSchema_Module_Factory);
}
else {
  var sampleJSONSchema_Module = sampleJSONSchema_Module_Factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.sampleJSONSchema = sampleJSONSchema_Module.sampleJSONSchema;
  }
  else {
    var sampleJSONSchema = sampleJSONSchema_Module.sampleJSONSchema;
  }
}