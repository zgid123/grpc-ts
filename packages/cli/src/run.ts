import { loadData } from './tasks/loadData';
import { loadConfig } from './utils/configuration';
import { createContent } from './tasks/createContent';
import { topologicalGroup } from './tasks/topologicalGroup';

async function generate(): Promise<void> {
  const config = await loadConfig();
  const protoData = await loadData(config);

  const groupedProtoData = topologicalGroup(protoData);

  createContent(groupedProtoData, config);
}

generate();
