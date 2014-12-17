<%@ page import="com.google.appengine.api.blobstore.BlobstoreServiceFactory" %>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService" %>

<%
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
%>


<html>
    <head>
        <title>Upload Test</title>
    </head>
    <body>
        <form action="<%= blobstoreService.createUploadUrl("/context/jerseyws/upload") %>" method="post" enctype="multipart/form-data">
            <p>Please upload your account logo</p>
            <input type="file" name="myFile">
            <input type="submit" value="Submit">
        </form>
    </body>
</html>