# AI-Agentic System Implementation Plan (MVP)

## Objective
Transform RAG chatbot into autonomous AI-Agentic system with reasoning, tool-calling, reflection, and evaluation.

## MVP Approach
Simplified implementation that meets all requirements with minimal complexity.

## Tools (2 Essential Tools)

### Tool 1: Vector Search Tool
- `server/services/tools/vectorSearchTool.js`
- Searches Qdrant vector DB for uploaded documents
- Returns: document chunks + confidence OR { found: false }
- Wraps existing QdrantVectorStoreService

### Tool 2: General Knowledge Tool
- `server/services/tools/generalKnowledgeTool.js`
- Uses GPT's built-in knowledge (no RAG context)
- Fallback when vector search returns no results
- Returns: answer from AI training data

## Agent Decision Flow
```
User Question → Agent Reasoning (ReAct)
  ↓
Try Vector Search Tool
  ↓
Found in documents? → Yes → Return with [Source: Documents]
  ↓ No
Try General Knowledge Tool
  ↓
Return with [Source: AI Knowledge]
```

## Implementation Phases

### Phase 1: Tools (30 min)
- Create vectorSearchTool.js (wrap existing Qdrant search)
- Create generalKnowledgeTool.js (simple LLM call)

### Phase 2: Agent Service (45 min)
- `server/services/agentService.js`
- Uses LangChain ReAct agent with both tools
- Returns: { answer, reasoning, toolsUsed, confidence }

### Phase 3: Evaluation (30 min)
- `server/services/evaluationService.js`
- Single function: evaluateResponse(question, answer, toolsUsed)
- Returns: { relevance: 1-5, clarity: 1-5, toolEffectiveness: 1-5 }
- Uses GPT to self-evaluate

### Phase 4: Integration (30 min)
- Update `/chat` route to use agentService
- Response: { answer, reasoning, toolsUsed, evaluation, source }

### Phase 5: Frontend (45 min)
- Update Chat.tsx with collapsible "Agent Trace" section
- Display: reasoning steps, tools used, source, confidence

### Phase 6: Documentation (30 min)
- Create `architecture.mmd` - Simple flowchart
- Update `README.md` - Add agentic features section

## Technologies
- LangChain ReAct Agent (reasoning built-in)
- LangChain DynamicStructuredTool
- OpenAI GPT-4 for agent reasoning
- Existing Qdrant vector store

## Success Criteria
✅ Agent reasons about tool selection
✅ Multi-tool execution (vector search → general knowledge)
✅ Self-reflection via evaluation service
✅ Automated quality scoring
✅ Complete documentation with architecture diagram
✅ Source attribution (documents vs AI knowledge)

## Timeline
Total: ~3 hours for full MVP implementation
