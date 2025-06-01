import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
	Shield,
	CheckCircle,
	XCircle,
	Clock,
	University,
	User,
	DollarSign,
} from "lucide-react";
import { useReleaseOrRefund } from "@/hooks/useRefundOrRelease";
import {
	queryCompletedPayments,
	queryDepositedPayments,
} from "@/graphql/payments.query";
import { useQuery } from "@tanstack/react-query";
import { REKT_SUBGRAPH_URL } from "@/constants/subgraph-url";
import request from "graphql-request";
import {
	universitiesMap,
	University as UniversityInterface,
} from "@/constants/universities";
import { getAddress } from "viem";
import { normalize } from "@/lib/bignumber";

interface Payment {
	id: string;
	paymentId: string;
	payer: string;
	university: string;
	invoiceRef: string;
	status: "Deposited" | "Released" | "Refunded";
	amount: string;
	updatedBlockTimestamp: string;
	createdBlockTimestamp: string;
}

interface FormattedPayment {
	id: string;
	payer: string;
	university: UniversityInterface;
	invoiceRef: string;
	status: "Deposited" | "Released" | "Refunded";
	amount: string;
	timestamp: string;
}

export const AdminPanel = () => {
	const [isLoading, setIsLoading] = useState<string | null>(null);
	const { mutation: releaseOrRefund } = useReleaseOrRefund();

	const {
		data: completedPaymentsData,
		isLoading: isCompletedLoading,
		refetch: refetchCompleted,
	} = useQuery({
		queryKey: ["completedPayments"],
		queryFn: () =>
			request<{ payments: Payment[] }>(
				REKT_SUBGRAPH_URL,
				queryCompletedPayments,
				{
					first: 10,
				}
			),
		select: (data) => {
			const formattedPayments = data.payments.map((payment) => ({
				id: payment.id,
				payer: payment.payer,
				university: universitiesMap[getAddress(payment.university)],
				amount: normalize(payment.amount, 6),
				invoiceRef: payment.invoiceRef,
				timestamp: payment.updatedBlockTimestamp,
				status: payment.status,
			}));
			const total = formattedPayments.reduce(
				(sum, payment) => sum + parseFloat(payment.amount),
				0
			);

			return { formattedPayments, total };
		},
		staleTime: 60000,
	});

	const {
		data: depositedPaymentsData,
		isLoading: isDepositedLoading,
		refetch: refetchDeposited,
	} = useQuery({
		queryKey: ["depositedPayments"],
		queryFn: () =>
			request<{ payments: Payment[] }>(
				REKT_SUBGRAPH_URL,
				queryDepositedPayments,
				{
					first: 10,
				}
			),
		select: (data) => {
			const formattedPayments = data.payments.map((payment) => ({
				id: payment.id,
				payer: payment.payer,
				university: universitiesMap[getAddress(payment.university)],
				amount: normalize(payment.amount, 6),
				invoiceRef: payment.invoiceRef,
				timestamp: payment.updatedBlockTimestamp,
				status: payment.status,
			}));
			const total = formattedPayments.reduce(
				(sum, payment) => sum + parseFloat(payment.amount),
				0
			);

			return { formattedPayments, total };
		},
		staleTime: 60000,
	});

	const refetchQueries = async () => {
		await Promise.all([refetchCompleted(), refetchDeposited()]);
	};

	const handlePaymentAction = async (
		payment: FormattedPayment,
		action: "release" | "refund"
	) => {
		setIsLoading(payment.id);
		try {
			await releaseOrRefund.mutateAsync(
				{
					paymentId: payment.id,
					option: action,
				},
				{
					onSuccess: () => {
						const messages = {
							release: {
								title: "Payment Released",
								description: `${payment.amount} USDC has been released to ${payment.university.name}.`,
							},
							refund: {
								title: "Payment Refunded",
								description: `${payment.amount} USDC has been refunded to the payer`,
							},
						};

						toast(messages[action]);
						refetchQueries();
					},
				}
			);
		} catch (error) {
			toast({
				title: `${action.charAt(0).toUpperCase() + action.slice(1)} Failed`,
				description:
					error instanceof Error
						? error.message
						: `Failed to ${action} payment. Please try again.`,
				variant: "destructive",
			});
		} finally {
			setIsLoading(null);
		}
	};

	const handleRelease = (payment: FormattedPayment) =>
		handlePaymentAction(payment, "release");

	const handleRefund = (payment: FormattedPayment) =>
		handlePaymentAction(payment, "refund");

	const formatAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	const formatDate = (timestamp: string) => {
		const date = new Date(Number(timestamp) * 1000);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
						<Clock className="h-3 w-3 mr-1" />
						Pending
					</Badge>
				);
			case "released":
				return (
					<Badge variant="secondary" className="bg-green-100 text-green-800">
						<CheckCircle className="h-3 w-3 mr-1" />
						Released
					</Badge>
				);
			case "refunded":
				return (
					<Badge variant="secondary" className="bg-red-100 text-red-800">
						<XCircle className="h-3 w-3 mr-1" />
						Refunded
					</Badge>
				);
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Shield className="h-5 w-5" />
						<span>Admin Panel</span>
					</CardTitle>
					<CardDescription>
						Manage pending payments and escrow releases
					</CardDescription>
				</CardHeader>
			</Card>

			{/* Stats */}
			<div className="grid md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<Clock className="h-5 w-5 text-yellow-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Pending Payments</p>
								<p className="text-2xl font-bold">
									{depositedPaymentsData?.formattedPayments.length ?? 0}
								</p>
								<p className="text-sm text-gray-500">
									${depositedPaymentsData?.total.toLocaleString() ?? 0} USDC
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<CheckCircle className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Total Processed</p>
								<p className="text-2xl font-bold">
									{completedPaymentsData?.formattedPayments.length ?? 0}
								</p>
								<p className="text-sm text-gray-500">
									${completedPaymentsData?.total.toLocaleString() ?? 0} USDC
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<DollarSign className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Total Volume</p>
								<p className="text-2xl font-bold">
									{(depositedPaymentsData?.formattedPayments.length ?? 0) +
										(completedPaymentsData?.formattedPayments.length ?? 0)}
								</p>
								<p className="text-sm text-gray-500">
									$
									{(
										(depositedPaymentsData?.total ?? 0) +
										(completedPaymentsData?.total ?? 0)
									).toLocaleString()}{" "}
									USDC
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Payments Table */}
			<Tabs defaultValue="pending" className="space-y-4">
				<TabsList>
					<TabsTrigger value="pending">
						Pending ({depositedPaymentsData?.formattedPayments.length ?? 0})
					</TabsTrigger>
					<TabsTrigger value="completed">
						Completed ({completedPaymentsData?.formattedPayments.length ?? 0})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="pending" className="space-y-4">
					{isDepositedLoading ? (
						<Card>
							<CardContent className="p-6 text-center">
								<p className="text-gray-600">Loading...</p>
							</CardContent>
						</Card>
					) : depositedPaymentsData?.formattedPayments.length === 0 ? (
						<Card>
							<CardContent className="p-6 text-center">
								<Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-600">No pending payments</p>
							</CardContent>
						</Card>
					) : (
						depositedPaymentsData?.formattedPayments.map((payment) => (
							<Card key={payment.id}>
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="space-y-3 flex-1">
											<div className="flex items-center space-x-3">
												<h3 className="font-medium text-lg">
													{payment.invoiceRef}
												</h3>
												{getStatusBadge(payment.status)}
											</div>

											<div className="grid md:grid-cols-2 gap-4 text-sm">
												<div className="space-y-2">
													<div className="flex items-center space-x-2">
														<University className="h-4 w-4 text-gray-500" />
														<span className="font-medium">University:</span>
														<span>{payment.university.name}</span>
													</div>
													<div className="flex items-center space-x-2">
														<User className="h-4 w-4 text-gray-500" />
														<span className="font-medium">Payer:</span>
														<code className="bg-gray-100 px-1 rounded">
															{formatAddress(payment.payer)}
														</code>
													</div>
													<div className="flex items-center space-x-2">
														<DollarSign className="h-4 w-4 text-gray-500" />
														<span className="font-medium">Amount:</span>
														<span className="font-bold text-green-600">
															{payment.amount} USDC
														</span>
													</div>
												</div>

												<div className="space-y-2">
													<div>
														<span className="font-medium text-gray-600">
															Date:
														</span>
														<p>{formatDate(payment.timestamp)}</p>
													</div>
												</div>
											</div>
										</div>

										<div className="flex space-x-2 ml-4">
											<Button
												onClick={() => handleRelease(payment)}
												disabled={isLoading === payment.id}
												className="bg-green-600 hover:bg-green-700"
											>
												<CheckCircle className="h-4 w-4 mr-1" />
												{isLoading === payment.id ? "Releasing..." : "Release"}
											</Button>
											<Button
												variant="outline"
												onClick={() => handleRefund(payment)}
												disabled={isLoading === payment.id}
												className="border-red-200 text-red-600 hover:bg-red-50"
											>
												<XCircle className="h-4 w-4 mr-1" />
												{isLoading === payment.id ? "Refunding..." : "Refund"}
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>

				<TabsContent value="completed" className="space-y-4">
					{isCompletedLoading ? (
						<Card>
							<CardContent className="p-6 text-center">
								<p className="text-gray-600">Loading...</p>
							</CardContent>
						</Card>
					) : completedPaymentsData?.formattedPayments.length === 0 ? (
						<Card>
							<CardContent className="p-6 text-center">
								<CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-600">No completed payments</p>
							</CardContent>
						</Card>
					) : (
						completedPaymentsData?.formattedPayments.map((payment) => (
							<Card key={payment.id}>
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="space-y-3 flex-1">
											<div className="flex items-center space-x-3">
												<h3 className="font-medium text-lg">
													{payment.invoiceRef}
												</h3>
												{getStatusBadge(payment.status)}
											</div>

											<div className="grid md:grid-cols-2 gap-4 text-sm">
												<div className="space-y-2">
													<div className="flex items-center space-x-2">
														<University className="h-4 w-4 text-gray-500" />
														<span className="font-medium">University:</span>
														<span>{payment.university.name}</span>
													</div>
													<div className="flex items-center space-x-2">
														<User className="h-4 w-4 text-gray-500" />
														<span className="font-medium">Payer:</span>
														<code className="bg-gray-100 px-1 rounded">
															{formatAddress(payment.payer)}
														</code>
													</div>
													<div className="flex items-center space-x-2">
														<DollarSign className="h-4 w-4 text-gray-500" />
														<span className="font-medium">Amount:</span>
														<span className="font-bold text-green-600">
															{payment.amount} USDC
														</span>
													</div>
												</div>

												<div className="space-y-2">
													<div>
														<span className="font-medium text-gray-600">
															Date:
														</span>
														<p>{formatDate(payment.timestamp)}</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};
