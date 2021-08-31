 <cfheader name="Access-Control-Allow-Origin" value="*">
    <cfheader name="Access-Control-Allow-Methods" value="OPTIONS,GET,PUT,POST,DELETE">

    <cfheader name="Access-Control-Allow-Headers" value="Origin, X-Requested-With, Content-Type, Accept">
    <cffunction name="init" access="remote" returntype="any">
        <cfreturn this/>
    </cffunction>
<cffile action="upload" filefield="Filedata" destination="#ExpandPath('./eventimages/')#" nameConflict="Overwrite" result="fileUpload">
