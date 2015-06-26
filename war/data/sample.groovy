import org.biopax.paxtools.io.SimpleIOHandler;
import org.biopax.paxtools.io.BioPAXIOHandler;
import org.biopax.paxtools.model.Model;
import org.biopax.paxtools.model.level3.*;

InputStream f = new FileInputStream(new File("./data/biopax3-short-metabolic-pathway.owl"));

BioPAXIOHandler handler = new SimpleIOHandler();
Model rawModel = handler.convertFromOWL(f);

f.close();

// Get all BiochemicalReactions
Set<BiochemicalReaction> rawModelObjects = rawModel.getObjects(BiochemicalReaction.class);

// Print participants in BiochemicalReactions
for (BiochemicalReaction rawModelObject : rawModelObjects) {
  String tmp = "BiochemicalReaction: " + rawModelObject.getRDFId();
  System.out.println(tmp);
}
