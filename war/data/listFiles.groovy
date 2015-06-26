// List files in directory
new File(".").eachFile() { file->
    println "Filename: " + file.getName()
}

// Print file contents
String fileContents = new File('./data/biopax3-short-metabolic-pathway.owl').text
println "Contents: " + fileContents

// Load file
InputStream f = new FileInputStream(new File("./data/biopax3-short-metabolic-pathway.owl"));
