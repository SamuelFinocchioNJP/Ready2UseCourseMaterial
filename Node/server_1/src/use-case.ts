// A use case is a single application operation. Each takes one input object
// (shaped { context, data }) and resolves to one output object.
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
